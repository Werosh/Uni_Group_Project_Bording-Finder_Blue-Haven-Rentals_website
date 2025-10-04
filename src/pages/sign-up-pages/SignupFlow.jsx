import { useSignup } from "../../context/SignupContext";
import GetStartedPage from "./GetStartedPage";
import SetupYourAccountPage from "./SetupYourAccountPage";
import SetupYourLocationPage from "./SetupYourLocationPage";
import VerifyYourIdPage from "./VerifyYourIdPage";
import SetupYourImagePage from "./SetupYourImagePage";

const SignupFlow = () => {
  const { currentStep } = useSignup();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GetStartedPage />;
      case 2:
        return <SetupYourAccountPage />;
      case 3:
        return <SetupYourLocationPage />;
      case 4:
        return <VerifyYourIdPage />;
      case 5:
        return <SetupYourImagePage />;
      default:
        return <GetStartedPage />;
    }
  };

  return <div>{renderStep()}</div>;
};

export default SignupFlow;
