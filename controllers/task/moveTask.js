const Task = require('../../models/taskModel');

const moveTask = async (req, res) => {
  console.log('moveTask controller');
  try {
    const { id } = req.params;
    const { listType } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task's listType
    task.listType = listType;

    // Save the updated task
    const updatedTask = await task.save();

    // Fetch all tasks for the project to get the updated order
    const allTasks = await Task.find({ project: task.project });

    // Sort tasks based on their listType and taskBoardOrder
    const sortedTasks = allTasks.sort((a, b) => {
      if (a.listType !== b.listType) {
        return a.listType.localeCompare(b.listType);
      }
      return a.taskBoardOrder - b.taskBoardOrder;
    });

    // Update taskBoardOrder for all tasks in the same listType
    const tasksInList = sortedTasks.filter((t) => t.listType === listType);
    for (let i = 0; i < tasksInList.length; i++) {
      tasksInList[i].taskBoardOrder = i;
      await tasksInList[i].save();
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in moveTask:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = moveTask;
