import { useEffect, useMemo, useRef, useState } from 'react';
import { MdChat, MdClose, MdSend, MdSmartToy } from 'react-icons/md';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface FaqRule {
  keywords: string[];
  answer: string;
}

const FAQ_RULES: FaqRule[] = [
  {
    keywords: ['bao gia', 'gia', 'bang gia'],
    answer:
      'Để nhận báo giá nhanh, bạn có thể bấm nút "Đăng ký báo giá" ở góc dưới bên phải hoặc để lại thông tin công ty. Nhân viên sẽ liên hệ trong giờ hành chính.',
  },
  {
    keywords: ['giao hang', 'ship', 'van chuyen'],
    answer:
      'Chúng tôi có hỗ trợ giao hàng nội thành và liên tỉnh. Thời gian giao hàng thường từ 1-3 ngày làm việc tùy khu vực và số lượng.',
  },
  {
    keywords: ['thanh toan', 'chuyen khoan', 'cod'],
    answer:
      'Hiện tại hỗ trợ thanh toán COD, chuyển khoản ngân hàng và tiền mặt (với một số đơn). Đơn doanh nghiệp có thể đối soát theo hóa đơn.',
  },
  {
    keywords: ['hoa don', 'vat', 'xuat hoa don'],
    answer:
      'Bên mình có hỗ trợ xuất hóa đơn VAT cho doanh nghiệp. Bạn vui lòng cung cấp thông tin xuất hóa đơn khi đặt hàng hoặc khi gửi yêu cầu báo giá.',
  },
  {
    keywords: ['doi tra', 'bao hanh', 'loi san pham'],
    answer:
      'Sản phẩm lỗi do nhà sản xuất sẽ được hỗ trợ đổi trả theo chính sách hiện hành. Bạn vui lòng giữ hóa đơn/chứng từ để được hỗ trợ nhanh.',
  },
  {
    keywords: ['lien he', 'tu van', 'hotline'],
    answer:
      'Bạn có thể liên hệ hotline 0947 900 666 hoặc gửi thông tin qua trang Liên hệ. Đội ngũ sẽ phản hồi sớm nhất có thể.',
  },
];

const QUICK_QUESTIONS = [
  'Làm sao để đăng ký báo giá?',
  'Bên mình có xuất hóa đơn VAT không?',
  'Thời gian giao hàng bao lâu?',
  'Có những hình thức thanh toán nào?',
];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getAnswerFromFaq = (question: string) => {
  const normalizedQuestion = normalizeText(question);

  const matchedRule = FAQ_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalizedQuestion.includes(keyword))
  );

  if (matchedRule) {
    return matchedRule.answer;
  }

  return 'Mình chưa hiểu rõ câu hỏi này. Bạn có thể hỏi về báo giá, giao hàng, thanh toán, hóa đơn VAT hoặc đổi trả. Mình sẽ hỗ trợ ngay!';
};

const FaqChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Xin chào! Mình là trợ lý FAQ AI. Bạn có thể hỏi về báo giá, giao hàng, thanh toán, hóa đơn VAT và chính sách đổi trả.',
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const unreadCount = useMemo(() => {
    if (isOpen) return 0;
    return Math.max(messages.filter((item) => item.role === 'assistant').length - 1, 0);
  }, [isOpen, messages]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const pushMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role,
        content,
      },
    ]);
  };

  const handleSendMessage = (presetQuestion?: string) => {
    const content = (presetQuestion ?? input).trim();
    if (!content || isTyping) return;

    pushMessage('user', content);
    setInput('');
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      const answer = getAnswerFromFaq(content);
      pushMessage('assistant', answer);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed left-4 bottom-20 z-[70] w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-red-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <MdSmartToy className="h-5 w-5" />
              <div>
                <p className="text-sm font-bold">FAQ Chatbot AI</p>
                <p className="text-xs text-red-100">Trả lời nhanh theo bộ câu hỏi mẫu</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 hover:bg-white/20"
              aria-label="Đóng chatbot"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>

          <div ref={messagesContainerRef} className="max-h-80 space-y-3 overflow-y-auto bg-red-50/30 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'assistant'
                      ? 'bg-white text-gray-700 shadow-sm border border-gray-100'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-gray-100 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                  Trợ lý đang trả lời...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSendMessage(question)}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập câu hỏi..."
                className="max-h-28 min-h-[42px] flex-1 resize-y rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isTyping}
                className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-red-600 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                aria-label="Gửi tin nhắn"
              >
                <MdSend className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed left-4 bottom-4 z-[65] flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-105 hover:bg-red-700"
      >
        <MdChat className="h-5 w-5" />
        <span>Hỏi đáp AI</span>
        {unreadCount > 0 && (
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-red-600">
            {unreadCount}
          </span>
        )}
      </button>
    </>
  );
};

export default FaqChatbotWidget;
