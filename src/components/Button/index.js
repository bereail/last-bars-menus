import React from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "./Button.styles";

// Botón reutilizable con redirección
const Button = ({ to, onClick, children, disabled, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledButton onClick={handleClick} disabled={disabled} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
