import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTokenFromShortCode } from "../../services/shareService";
import FlowvaLoader from "../../components/common/loading";

export default function ShortRedirect() {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shortCode) return;

    fetchTokenFromShortCode(shortCode)
      .then((token) => {
        localStorage.setItem("sharedToken", token);
        localStorage.setItem("sharedFlow", "true");
        navigate("/signin");
      })
      .catch((err) => {
        console.error("Error resolving shortcode:", err);
        navigate("/404");
      });
  }, [shortCode]);

  return (
    <div className="min-h-[100svh] flex justify-center items-center">
      <FlowvaLoader />
    </div>
  );
}
