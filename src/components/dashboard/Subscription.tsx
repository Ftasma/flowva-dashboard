import React from "react";

const Subscription: React.FC = () => {
  return (
    <div className="min-h-screen md:h-[calc(100vh-2rem)] flex flex-col px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-2 pl-11 md:pt-10 gap-4">
        <div className="text-left">
          <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">
            Subscription
          </h2>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div>
          <h2 className="text-lg md:text-xl text-center text-[#64748B]">
            Your subscriptions will show up here.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
