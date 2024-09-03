import {  useState } from "react";
import Chatbot from "../../components/Chatbot/Chatbot";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import PopularTasks from "../../components/PopularTasks/PopularTasks";
import Testimonial from "../../components/Testimonial/Testimonial";
import Footer from "../../components/Footer/Footer";


const Home = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
  const closeChatbot = () => {
    setChatOpen(false);
  };
  

  return (
    <div>
      <Hero/>
      <HowItWorks/>
      <PopularTasks/>
      <Testimonial/>
      <Footer/>
      <button 
        className="fixed bottom-8 right-8 bg-purple-600 text-white rounded-full p-4 shadow-lg" 
        onClick={toggleChat}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2h5l2 2 2-2z" />
        </svg>
      </button>
      {chatOpen && <Chatbot onClose={closeChatbot}/>}
    </div>
  )
}

export default Home