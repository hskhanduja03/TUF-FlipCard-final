import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

function Test() {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return <div>Loading...</div>; // Optionally show a loading state while fetching user data
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      User found: {JSON.stringify(user)}
    </div>
  );
}

export default Test;
