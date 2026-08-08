import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Chaudhary Aslam',
    role: 'Wheat Farmer, Okara',
    rating: 5,
    text: 'AgriConnect has made it so easy to check mandi rates daily. The farming tips are also very helpful for our seasonal crops.',
    textUrdu: 'ایگری کنیکٹ نے روزانہ منڈی کے نرخ چیک کرنا بہت آسان بنا دیا ہے۔',
  },
  {
    name: 'Saira Bibi',
    role: 'Home Maker, Lahore',
    rating: 5,
    text: 'The quality of vegetables and fruits is exceptional. It feels like they were just picked from the farm this morning.',
    textUrdu: 'سبزیوں اور پھلوں کا معیار لاجواب ہے۔ ایسا لگتا ہے جیسے آج صبح ہی کھیت سے توڑے گئے ہوں۔',
  },
  {
    name: 'M. Rashid',
    role: 'Retailer, Multan',
    rating: 4,
    text: 'Great platform for both sellers and buyers. The interface is clean and the WhatsApp ordering feature is a game changer.',
    textUrdu: 'بیچنے والوں اور خریداروں دونوں کے لیے بہترین پلیٹ فارم۔',
  },
];

const Reviews = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 ac-slide-up">
          <h2 className="text-4xl font-serif font-bold text-gray-900">What Our Community Says</h2>
          <p className="text-gray-600 mt-2">Trusted by thousands of farmers and customers across Punjab.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => {
            const animStyles = 
              idx === 0 ? "ac-slide-left ac-delay-1" :
              idx === 1 ? "ac-slide-up ac-delay-2" :
              "ac-slide-right ac-delay-3";
            return (
              <div key={idx} className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative ${animStyles}`}>
                <Quote className="absolute top-6 right-8 w-12 h-12 text-agri-green/5" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-agri-orange fill-agri-orange' : 'text-gray-300'}`} 
                  />
                ))}
              </div>

              <p className="text-gray-700 italic mb-4 leading-relaxed">"{review.text}"</p>
              <p className="text-agri-green font-medium text-right mb-6 font-serif" dir="rtl">{review.textUrdu}</p>

              <div className="flex items-center gap-4 border-t pt-6">
                <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center text-agri-green font-bold text-xl">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
};

export default Reviews;
