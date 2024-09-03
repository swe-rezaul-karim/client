import { useEffect, useState } from "react";

const Testimonial = () => {
  const [testimonial, setTestimonial] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonial(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-32 mt-16">
      <h2 className="text-4xl font-bold text-center text-primary mb-12">
        What Our Customers Say
      </h2>
      <div className="carousel w-full md:h-[500px] relative">
        {testimonial.map((test, index) => (
          <div
            id={test.id}
            key={index}
            className="carousel-item relative w-full text-center flex justify-center items-center"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
              <div className="w-24 h-24 mx-auto mb-6">
                <img
                  className="w-24 h-24 rounded-full mx-auto border-4 border-primary"
                  src={test.image_url}
                  alt={test.name}
                />
              </div>
              <div className="rating mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`mask mask-star-2 ${i < test.rating ? 'bg-orange-400' : 'bg-gray-300'}`}></span>
                ))}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {test.title}
              </h3>
              <p className="mb-6 text-lg font-medium text-gray-600">
                {test.message}
              </p>
              <div className="text-center">
                <h4 className="font-bold text-gray-700">{test.name}</h4>
                <p className="text-gray-500">{test.address}</p>
              </div>
            </div>
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={`#${test.id - 1}`} className="btn btn-circle bg-primary text-white hover:bg-primary-dark">
                ❮
              </a>
              <a href={`#${test.id + 1}`} className="btn btn-circle bg-primary text-white hover:bg-primary-dark">
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
