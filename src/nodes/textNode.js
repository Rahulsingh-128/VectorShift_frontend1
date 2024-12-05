import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { TextField, Box, Typography, IconButton, Tooltip } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || "");
  const [variables, setVariables] = useState([]);

  // Adjust the width dynamically based on text length
  const adjustedWidth = Math.min(Math.max(text.length * 8, 100), 300);

  // Handle text change and extract variables
  const handleChange = (event) => {
    const value = event.target.value;
    setText(value);
    extractVariables(value);
  };

  // Extract variables enclosed within {{ }}
  const extractVariables = (value) => {
    const matches = [...value.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
    setVariables(matches.map((match) => match[1]));
  };

  // Handle closing the TextNode
  const handleClose = () => {
    if (data.onRemoveNode) {
      data.onRemoveNode(id);
    }
  };

  useEffect(() => {
    if (typeof data.onUpdate === "function") {
      data.onUpdate({ text, variables });
    }
  }, [text, variables, data]);

  return (
    <Box
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        width: `${adjustedWidth}px`,
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          Text Node
        </Typography>
        <Box>
          <Tooltip title="Close">
            <IconButton size="small" onClick={handleClose} aria-label="close">
              <HighlightOffIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Text Input */}
      <TextField
        multiline
        fullWidth
        minRows={1}
        maxRows={5}
        value={text}
        onChange={handleChange}
        placeholder="Type your text here..."
        variant="outlined"
        style={{
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      />

      {/* Handles */}
      {/* <Handle type="target" position={Position.Left} id="input" /> */}
      {variables.map((variable) => (
        <Handle
          key={variable}
          type="target"
          position={Position.Left}
          id={variable}
          style={{ top: "auto", bottom: variables.indexOf(variable) * 20 + 20 }}
        />
      ))}

      <Handle type="source" position={Position.Right} id="output" />
    </Box>
  );
};
