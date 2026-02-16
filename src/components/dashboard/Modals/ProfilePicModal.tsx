import { Modal } from "antd";

type ProfilePic = {
  imgUrl: string;
  firstName: string;
  lastName?: string;
  open: boolean;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function ProfilePicModal({
  imgUrl,
  closeModal,
  open,
  firstName,
  lastName,
}: ProfilePic) {
  return (
    <Modal
      open={open}
      onCancel={() => closeModal(false)}
      footer={null}
      title="Avatar"
      style={{ maxWidth: "320px" }}
    >
      <div className="bg-white grid place-items-center">
        <hr />
        {imgUrl ? (
          <>
            <div className="relative h-full max-h-[350px] w-full ">
              <img
                src={imgUrl}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <hr />
            <div className="place-self-start text-center mt-2 w-full">
              <p className="text-black px-2">{firstName + " " + lastName}</p>
            </div>
          </>
        ) : (
          <div className="text-[#9013FE] rounded-md bg-[#e5e7eb] h-[350px]  w-full text-6xl font-bold flex justify-center items-center">
            {firstName.charAt(0)}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ProfilePicModal;
