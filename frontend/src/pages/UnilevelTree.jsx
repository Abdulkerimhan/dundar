import React from "react";
import "./SuperAdmin.css"; // CSS aynı dosyada birleştiği için ekstra dosya gerekmez

export default function UnilevelTree({ user }) {
  const renderTree = (node) => (
    <li key={node._id}>
      <span className="unilevel-user">{node.username}</span>
      {node.team && node.team.length > 0 && (
        <ul>
          {node.team.map((child) => renderTree(child))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="unilevel-tree">
      <h2>🌳 Ünilevel Ağaç</h2>
      {user ? <ul>{renderTree(user)}</ul> : <p>Veri bulunamadı</p>}
    </div>
  );
}
