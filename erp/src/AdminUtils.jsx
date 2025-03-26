import React from "react";

const AdminUtils = () => {
  return (
    <div>
      <button>Post Assignment</button>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input type="text" name="description" />
      </div>
      <div>
        <label htmlFor="file">Upload File or PDF</label>
        <input type="file" name="file" />
      </div>
      <div>
        <label htmlFor="due_date">Due Date</label>
        <input type="date" name="due_date" />
      </div>
    </div>
  );
};

export default AdminUtils