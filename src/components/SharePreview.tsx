// import { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Card, Button, Spin, Alert, message } from "antd";
// import { getSharedPreview, acceptShare } from "../services/shareService";
// import type { CSSProperties } from "react";
// import { useSubscription } from "../hooks/usesubscriptions";
// import supabase from "../lib/supabase";

// interface PreviewData { 
//   itemType: "tool" | "collection"; 
//   itemId: string; 
//   sharedVia: string; 
//   senderName: string;
// }

// interface SharePreviewResponse {
//   item_type: "tool" | "collection";
//   item_id: string;
//   shared_via: string;
//   sender_name: string | null;
// }

// export default function SharePreview() {
//   const { token } = useParams<{ token: string }>();
//   const nav = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [preview, setPreview] = useState<PreviewData|null>(null);
//   const [error, setError] = useState<string|null>(null);
//   const [accepting, setAccepting] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [authLoading, setAuthLoading] = useState<boolean>(true);

//   const { userType, loading: subLoad } = useSubscription();
//   const isFree = userType === "free";

//   // Check authentication status
//   useEffect(() => {
//     async function checkAuthStatus() {
//       setAuthLoading(true);
//       try {
//         const { data } = await supabase.auth.getSession();
//         setIsAuthenticated(!!data.session);
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         setIsAuthenticated(false);
//       } finally {
//         setAuthLoading(false);
//       }
//     }
    
//     checkAuthStatus();
//   }, []);

//   // Fetch preview data
//   useEffect(() => {
//     if (!token) return;
//     setLoading(true);

//     getSharedPreview(token)
//       .then((data: SharePreviewResponse) => {
//         console.log("API response:", data); // Debug log
        
//         const transformedData: PreviewData = {
//           itemType: data.item_type,
//           itemId: data.item_id,
//           sharedVia: data.shared_via,
//           senderName: data.sender_name || "Someone",
//         };
//         console.log("Transformed data:", transformedData); // Debug log
//         setPreview(transformedData);
//       })
//       .catch(e => {
//         console.error("Error fetching preview:", e);
//         setError(e.message);
//       })
//       .finally(() => setLoading(false));
//   }, [token]);

//   const handleAccept = async () => {
//     if (!token || !isAuthenticated) return;
//     setAccepting(true);
//     try {
//       const result = await acceptShare(token);
//       console.log("Share accepted:", result);
//       message.success("Accepted!");
//       nav("/shared");
//     } catch (e: any) {
//       console.error("Error accepting share:", e);
//       message.error(e.message);
//     } finally {
//       setAccepting(false);
//     }
//   };

//   if (loading || authLoading || subLoad) return <Spin />;
//   if (error) return <Alert type="error" message={error} />;
//   if (!preview) return <Alert type="error" message="No preview data available" />;

//   const blur: CSSProperties = isFree
//     ? { filter: "blur(4px)", pointerEvents: "none" }
//     : {};

//   return (
//     <div>
    
      
//       <Card title={`${preview.senderName} shared a ${preview.itemType} with you on Flowva`} style={{ maxWidth: 600, margin: "auto" }}>
//         <div style={blur}>
//           <p><strong>Item ID:</strong> {preview.itemId}</p>
//           <p><strong>Via:</strong> {preview.sharedVia}</p>
//         </div>

//         {!isAuthenticated && (
//           <Alert 
//             message="Please sign in or create an account to accept." 
//             type="info" 
//             action={<Button type="link" onClick={() => nav("/signin")}>Sign in</Button>} 
//             style={{ margin: "16px 0" }} 
//           />
//         )}

//         {isAuthenticated && (
//           <>
//             {isFree && (
//               <Alert
//                 message="Upgrade to Pro/Teams to view content."
//                 type="warning"
//                 style={{ margin: "16px 0" }}
//               />
//             )}
//             <Button 
//               type="primary"
//               loading={accepting}
//               disabled={isFree}
//               onClick={handleAccept}
//             >
//               Accept
//             </Button>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }


// export default function SharePreview() {
//   const { token } = useParams<{ token: string }>();
//   const navigate = useNavigate();

//   // As soon as they land on /share/:token →
//   //  • stash for later
//   //  • mark the shared-flow
//   //  • send to sign-in
//   useEffect(() => {
//     if (!token) return;
//     localStorage.setItem("sharedToken", token);
//     localStorage.setItem("sharedFlow", "true");
//     navigate("/library/shared");
//   }, [token, navigate]);

//   // We don't actually render anything here
//   return null;
// }
