import React from "react";
import { ListTodo, CheckCircle2 } from "lucide-react";
import { getPriorityColor } from "../utils/utils";

const TaskComponent = ({ tasks, filterStatus, setFilterStatus }) => {
  const filteredTasks =
    filterStatus === "pending" ? tasks.filter((t) => !t.completed) : tasks;

  return (
    <div className="lg:col-span-1 flex flex-col gap-4 h-full min-h-0">
      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
              filterStatus === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Tasks</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <ListTodo className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No tasks yet</p>
            </div>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-lg border-2 transition ${
                task.completed
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium text-sm mb-1 ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-gray-600 mb-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-medium ${getPriorityColor(
                        task.priority,
                      )}`}
                    >
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{task.due_date}</span>
                      </>
                    )}
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-400">#{task.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;
