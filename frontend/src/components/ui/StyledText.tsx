import './styles.css';

const GetStuffDone = () => {
  return (
    <div className="contentContainer text-center font-mono">
      <div 
        className="getStuffDone 
          pt-[100px] sm:pt-[120px] md:pt-0" 
        // Adds padding on smaller screens
      >
        {/* "Get Stuff" heading with 15-degree rotation and boldness */}
        <h1
          className={`
            gs block max-w-full h-auto font-extrabold
            text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px]
            leading-[1] sm:leading-[0.9] md:leading-[0.8] lg:leading-[0.9]
            transform -rotate-[15deg] origin-top-left
          `}
        >
          Get Stuff
        </h1>
        {/* "DONE!" heading with 15-degree rotation and boldness */}
        <h1
          className={`
            gsd font-extrabold
            text-[80px] sm:text-[120px] md:text-[150px] lg:text-[180px]
            leading-[0.85] sm:leading-[1] md:leading-[1.1] lg:leading-[1.1]
            transform -rotate-[15deg] origin-top-left
          `}
        >
          DONE!
        </h1>
      </div>
    </div>
  );
};

export default GetStuffDone;
