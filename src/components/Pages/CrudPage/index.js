import React from "react";
import Button from "../../Button";

const CrudPage = () => {
  return (
    <div>
      <h1>CRUD Page</h1>
      <Button to="/addComponent">Add Component</Button>
      <Button to="/editComponent">Edit Component</Button>
      <Button to="/deleteComponent">Delete Component</Button>
    </div>
  );
};

export default CrudPage;
