import { useFormContext } from "../../../context/UserContext";



function WelcomeModal() {
 

  const { userData } = useFormContext()

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full bg-white flex flex-col items-center transition-all duration-200 ease">
      <div className="bg-white p-[2.5rem] rounded-[16px] text-center max-w-[400px] w-[90%] shadow-[0_10px_30px_rgba(0,0,0,0.1)] animate-fadeIn">
        <h2 className="text-[#9013FE] mb-[1.5rem] text-[1.5rem] font-bold tex-center">
          Welcome{" "}
          <span>
            {userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1)}
          </span>
          !
        </h2>
        <p className="text-[0.95rem] text-[#495057] mb-[1.5rem] text-center">
          Taking you to your personalized dashboard now
        </p>
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default WelcomeModal;
