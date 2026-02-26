import React from "react";
import AcceptTask from "./AcceptTask";
import NewTask from "./NewTask";
import CompleteTask from "./CompleteTask";
import FailedTask from "./FailedTask";

const TaskList = ({ tasks, updateTask, deleteTask }) => {
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Your Tasks</h3>
      <div
        id="TaskList"
        className="overflow-x-auto flex items-stretch justify-start gap-6 flex-nowrap w-full pb-8 custom-scrollbar"
      >
        {tasks.map((ele, index) => {
          if (ele.active) {
            return <AcceptTask key={ele.id || index} data={ele} updateTask={updateTask} deleteTask={deleteTask} />;
          }
          if (ele.newTask) {
            return <NewTask key={ele.id || index} data={ele} updateTask={updateTask} deleteTask={deleteTask} />;
          }
          if (ele.completed) {
            return <CompleteTask key={ele.id || index} data={ele} deleteTask={deleteTask} />;
          }
          if (ele.failed) {
            return <FailedTask key={ele.id || index} data={ele} deleteTask={deleteTask} />;
          }
          return null;
        })}
        {tasks.length === 0 && (
          <div className="w-full text-center text-gray-500 py-10 text-xl backdrop-blur bg-white/5 border border-white/10 rounded-3xl">
            You currently have no tasks assigned.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
