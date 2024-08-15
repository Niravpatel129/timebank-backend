const Project = require('../../models/projectModel');
const OpenAI = require('openai');

const aiGenerateTask = async (req, res) => {
  try {
    console.log('aiGenerateTask called');
    const { projectId, taskDescription } = req.body;
    console.log('🚀  taskDescription:', taskDescription);

    const userId = req.user._id;
    console.log(`Received request for project: ${projectId}, user: ${userId}`);

    // Check if the project exists and the user is a member
    const project = await Project.findOne({ _id: projectId, 'members.user': userId });
    if (!project) {
      console.log(
        `Project not found or user is not a member. ProjectId: ${projectId}, UserId: ${userId}`,
      );
      return res.status(404).json({ message: 'Project not found or user is not a member' });
    }
    console.log(`Project found: ${project._id}`);

    // Check if taskDescription is empty or contains only whitespace
    if (!taskDescription || taskDescription.trim() === '') {
      return res.status(400).json({ message: 'Task description is required' });
    }

    // Initialize OpenAI API
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    console.log('OpenAI API initialized');

    // Generate task details using OpenAI
    console.log(`Sending request to OpenAI with task description: "${taskDescription}"`);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful project management assistant.' },
        {
          role: 'user',
          content: `Based on this task description: "${taskDescription}", generate a task name (in a "to-do" format, starting with a verb), category, timer type (countup or countdown), and a brief description of the task. Also, suggest a priority level (low, medium, high) and an estimated duration in hours (only if timer type is countdown). Format the response as JSON.`,
        },
        {
          role: 'system',
          content: `The response should be in JSON format with the following structure:
          {
            "taskName": "...",
            "category": "...",
            "timerType": "...",
            "duration": ...,
            "priority": "...",
            "description": "..."
          }
          Note: If timerType is "countup", omit the "duration" field. Ensure the taskName starts with a verb and is in a "to-do" format. Do not include any markdown formatting in your response.`,
        },
      ],
    });
    console.log('Received response from OpenAI');

    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
      console.log(`AI Response:`, aiResponse);

      const requiredFields = ['taskName', 'category', 'timerType', 'priority', 'description'];
      for (const field of requiredFields) {
        if (!aiResponse[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      if (!['low', 'medium', 'high'].includes(aiResponse.priority.toLowerCase())) {
        throw new Error('Invalid priority level');
      }

      if (aiResponse.timerType === 'countdown') {
        if (typeof aiResponse.duration !== 'number' || aiResponse.duration <= 0) {
          throw new Error('Invalid duration for countdown timer');
        }
      }
    } catch (error) {
      console.error('Error parsing or validating AI response:', error);
      return res
        .status(500)
        .json({ message: 'Error processing AI response', error: error.message });
    }

    // Create the task object
    const generatedTask = {
      name: aiResponse.taskName,
      category: aiResponse.category,
      description: aiResponse.description,
      timerType: aiResponse.timerType,
      project: projectId,
      user: userId,
      date: new Date().toISOString().split('T')[0],
      taskPriority:
        aiResponse.priority.toLowerCase() === 'high'
          ? 2
          : aiResponse.priority.toLowerCase() === 'medium'
          ? 1
          : 0,
    };

    if (aiResponse.timerType === 'countdown' && aiResponse.duration) {
      generatedTask.taskDuration = Math.round(aiResponse.duration * 3600); // Convert hours to seconds and round to nearest integer
    }

    console.log('Generated task:', generatedTask);

    res.status(200).json({ message: 'Task generated', task: generatedTask });
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Error in aiGenerateTask:', error);
    res.status(500).json({ message: 'Error generating task', error: error.message });
  }
};

module.exports = aiGenerateTask;
