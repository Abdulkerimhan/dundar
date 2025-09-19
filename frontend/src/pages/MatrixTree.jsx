import React from "react";
import "./MatrixTree.css";

function MatrixNode({ user }) {
  return (
    <div className="matrix-node">
      {user.username}
      {user.matrixChildren && user.matrixChildren.length > 0 && (
        <>
          <div className="matrix-line"></div>
          <div className="matrix-children">
            {user.matrixChildren.map((child) => (
              <MatrixNode key={child._id} user={child} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function MatrixTree({ root }) {
  return (
    <div className="matrix-tree">
      <h2>📐 Matrix Ağaç</h2>
      <MatrixNode user={root} />
    </div>
  );
}
