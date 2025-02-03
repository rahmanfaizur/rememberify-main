// GetStuffDone.jsx
import './styles.css';
const GetStuffDone = () => {
  return (
    <div className="contentContainer text-center font-yahoo-sans">
      <div className="getStuffDone">
        {/* "Get Stuff" heading with rotation */}
        <h1 className="gs block max-w-full h-auto text-[84px] md:text-[56px] leading-[1] md:leading-[0.2] transform -rotate-6 origin-top-left">
          Get Stuff
        </h1>
        
        {/* "DONE!" heading with rotation */}
        <h1 className="gsd text-[188px] md:text-[132px] leading-[0.85] md:leading-[1.2] transform -rotate-6 origin-top-left">
          DONE!
        </h1>
      </div>
    </div>
  );
};

export default GetStuffDone;