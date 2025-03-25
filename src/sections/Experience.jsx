import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { workExperiences } from '../constants/index.js';

const WorkExperience = () => {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [expandedExperience, setExpandedExperience] = useState(null);

  const handleExperienceClick = (experience) => {
    setSelectedExperience(experience);
  };

  const toggleExpand = (id) => {
    setExpandedExperience(expandedExperience === id ? null : id);
  };

  return (
    <section className="c-space my-20" id="work">
      <div className="w-full text-white-600">
        <p 
          className="head-text"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          My Work Experience
        </p>

        <div className="work-content w-full max-w-3xl mx-auto mt-10"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <div className="sm:py-10 py-5 sm:px-5 px-2.5 ">
            {workExperiences.map((item, index) => (
              <div
                key={index}
                className={`work-content_container group ${selectedExperience?.id === item.id ? 'border-blue-500 bg-black-300' : ''}`}
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay={300 + (index * 100)}
              >
                <div 
                  className="flex flex-col h-full justify-start items-center py-2"
                  onClick={() => handleExperienceClick(item)}
                >
                  <div className="work-content_logo">
                    <img className="w-full h-full" src={item.icon} alt="" />
                  </div>

                  <div className="work-content_bar" />
                </div>

                <div className="sm:p-5 px-2.5 py-5 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white-800">{item.name}</p>
                      <p className="text-sm mb-1">
                        {item.pos} — <span>{item.duration}</span>
                      </p>
                      <p className="group-hover:text-white transition-all ease-in-out duration-500">{item.title}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(item.id);
                      }}
                      className="p-1 text-white-600 hover:text-white-100 transition-colors duration-200 focus:outline-none"
                      aria-label={expandedExperience === item.id ? "Collapse details" : "Expand details"}
                    >
                      {expandedExperience === item.id ? 
                        <HiChevronUp className="w-5 h-5" /> : 
                        <HiChevronDown className="w-5 h-5" />
                      }
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedExperience === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          ease: 'easeInOut'
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4">
                          <ul className="list-disc pl-5 space-y-2 text-white-600">
                            <motion.li 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              Collaborated on the development of Low Code Software-as-a-Service (SaaS) solutions
                            </motion.li>
                            <motion.li 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              Created Programming bots by designing, building, testing, and configuring automation workflows
                            </motion.li>
                            <motion.li 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              Developed AI fabrics, prototypes, and proof of concepts to enhance intelligent process automation
                            </motion.li>
                            <motion.li 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              Enhanced the efficiency of the Investment Management Department reducing the time of analysis of credit ratings, coupon reports by 90%
                            </motion.li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
