import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const feedbacks = [
  { id: 1, user: 'Amit Kumar', role: 'Chef', message: 'The AI meal prediction is very accurate. It saved us a lot of food waste this week.', rating: 5, time: '2 hours ago', positive: true },
  { id: 2, user: 'Priya Sharma', role: 'Manager', message: 'The redistribution tracking is excellent. We can now see exactly where surplus food is going.', rating: 4, time: '5 hours ago', positive: true },
  { id: 3, user: 'Ravi Patel', role: 'Kitchen Staff', message: 'The sensor alerts are sometimes delayed. Would love real-time push notifications.', rating: 3, time: '1 day ago', positive: false },
  { id: 4, user: 'Sunita Devi', role: 'Volunteer', message: 'Very helpful platform for coordinating food pickups with the Asha Foundation.', rating: 5, time: '2 days ago', positive: true },
];

export default function Feedback() {
  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Avg. Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-3xl font-bold text-gray-900">4.3</p>
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={14} className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Responses</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{feedbacks.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Positive Sentiment</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {Math.round(feedbacks.filter(f => f.positive).length / feedbacks.length * 100)}%
          </p>
        </div>
      </div>

      {/* Feedback cards */}
      <div className="grid grid-cols-2 gap-4">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                  {fb.user[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{fb.user}</p>
                  <p className="text-xs text-gray-500">{fb.role}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{fb.time}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">"{fb.message}"</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < fb.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              {fb.positive
                ? <ThumbsUp size={14} className="text-green-500" />
                : <ThumbsDown size={14} className="text-red-400" />
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
