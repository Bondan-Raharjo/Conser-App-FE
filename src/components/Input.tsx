import React from "react";
import TextField from "@mui/material/TextField";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, required = false }) => {
  return (
    <TextField
      type={type}
      label={placeholder}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      margin="normal"
      required={required}
    />
  );
};

export default Input;