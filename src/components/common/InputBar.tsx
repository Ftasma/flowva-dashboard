import React, { useRef } from "react";

interface InputBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputBar: React.FC<InputBarProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full flex justify-center">
      <input
        ref={inputRef}
        required
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="py-5 rounded-full border-[#9013FE] text-black border-2 px-8 w-full max-w-[450px] outline-none focus:border-[#9013FE] text-sm sm:text-base"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{
          WebkitAppearance: "none",
          position: "relative",
          WebkitTapHighlightColor: "transparent",
        }}
      />
    </div>
  );
};

export default InputBar;
