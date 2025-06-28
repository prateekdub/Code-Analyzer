import React, { useEffect, useRef, useState } from "react";
import { Draggable } from "../../lib/DragDropProvider.js";
import "./TaskCard.css";
import { STATUS_COLOR } from "../config.js";

export function TaskCard({ task, addSubtask, showAdd=false, status, updateTaskTitle, data }) {
  const [showInput, setShowInput] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const ref = useRef()
  useEffect(() => {
    if (STATUS_COLOR[status]) {
      ref.current.style.backgroundColor = STATUS_COLOR[status];
    }
  }, [status])
  const handleUpdateSubtask = () => {
    if (subtaskTitle.trim()) {
      updateTaskTitle(task, subtaskTitle)
      setSubtaskTitle("");
      setShowInput(false);
      
    }
  };
  const showInputField = (e) => {
    e.stopPropagation();
    setShowInput(!showInput)
  }
  const addTask = (task, e) => {
    e.stopPropagation();
    addSubtask(task)
  }
}

// export default TaskCard