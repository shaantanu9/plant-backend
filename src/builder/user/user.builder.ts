import { toObjectId } from '@utils';

export const searchUsers = (payload: any) => {
  const pipline = [];
  let sortOrder = -1;

  // const filterConditions: any = { $match: { $and: [] } };
  const matchCriteria: any = { $match: { $and: [] } };

  if (payload.search) {
    matchCriteria.$match.$and.push({
      $or: [
        { name: { $regex: payload.search, $options: 'si' } },
        { email: { $regex: payload.search, $options: 'si' } },
        { fatherName: { $regex: payload.search, $options: 'si' } },
        { motherName: { $regex: payload.search, $options: 'si' } },
        { uncleName: { $regex: payload.search, $options: 'si' } },
        { hobbies: { $regex: payload.search, $options: 'si' } },
        { education: { $regex: payload.search, $options: 'si' } },
        { expectations: { $regex: payload.search, $options: 'si' } },
        { bio: { $regex: payload.search, $options: 'si' } },
        { subCaste: { $regex: payload.search, $options: 'si' } },
        { 'address.city': { $regex: payload.search, $options: 'si' } },
        { 'address.state': { $regex: payload.search, $options: 'si' } },
        { 'address.country': { $regex: payload.search, $options: 'si' } },
      ],
    });
  }
  payload.salaryRange &&
    matchCriteria.$match.$and.push({
      salary: { $gte: payload.salaryRange[0], $lte: payload.salaryRange[1] },
    });
  payload.heightRange &&
    matchCriteria.$match.$and.push({
      height: { $gte: payload.heightRange[0], $lte: payload.heightRange[1] },
    });
  payload.ageRange &&
    matchCriteria.$match.$and.push({
      dob: { $gte: payload.ageRange[0], $lte: payload.ageRange[1] },
    });
  // brother 0 to given range
  payload.brother &&
    matchCriteria.$match.$and.push({
      brother: { $gte: 0, $lte: payload.brother },
    });
  // sister 0 to given range
  payload.sister &&
    matchCriteria.$match.$and.push({
      sister: { $gte: 0, $lte: payload.sister },
    });

  if (payload.sort) {
    if (payload.sort === 'age') {
      sortOrder = 1;
    }
    if (payload.sort === 'height') {
      sortOrder = 1;
    }
    if (payload.sort === 'salary') {
      sortOrder = 1;
    }
  } else {
    sortOrder = -1;
  }

  // pipline.push(matchCriteria);
  matchCriteria.$match.$and.length > 0 && pipline.push(matchCriteria);

  if (payload.sort) {
    pipline.push({ $sort: { [payload.sort]: sortOrder } });
  }

  return pipline;
};

// export const getAnalytics = (payload: any) => {
//   const pipeline = [
//     {
//       $match: { _id: toObjectId(payload.userId) },
//     },
//     {
//       $lookup: {
//         from: "bookmarks",
//         localField: "_id",
//         foreignField: "createdBy",
//         as: "bookmarks",
//       },
//     },
//     {
//       $lookup: {
//         from: "tasks",
//         localField: "_id",
//         foreignField: "createdBy",
//         as: "tasks",
//       },
//     },
//     {
//       $lookup: {
//         from: "journal",
//         localField: "_id",
//         foreignField: "createdBy",
//         as: "journals",
//       },
//     },
//     {
//       $lookup: {
//         from: "quize_progress",
//         localField: "_id",
//         foreignField: "userId",
//         as: "quize_progress",
//       },
//     },
//     {
//       $project: {
//         bookmarkSaved: { $size: "$bookmarks" },
//         taskCompleted: {
//           $size: {
//             $filter: {
//               input: "$tasks",
//               as: "task",
//               cond: { $eq: ["$$task.status", "completed"] },
//             },
//           },
//         },
//         taskCreated: { $size: "$tasks" },
//         journalCreated: { $size: "$journals" },
//         mistakesMade: { $sum: "$journals.mistakes" }, // Assuming `mistakes` is a field in `journals`
//         notesTaken: { $sum: "$journals.notes" }, // Assuming `notes` is a field in `journals`
//         quizTaken: { $size: "$quize_progress" },
//       },
//     },
//   ];

//   return pipeline;
// };

export const getAnalytics = (payload: any) => {
  const pipeline = [
    {
      $match: { _id: toObjectId(payload.userId) },
    },
    {
      $lookup: {
        from: 'bookmarks',
        localField: '_id',
        foreignField: 'createdBy',
        as: 'bookmarks',
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: 'createdBy',
        as: 'tasks',
      },
    },
    {
      $lookup: {
        from: 'journal',
        localField: '_id',
        foreignField: 'createdBy',
        as: 'journals',
      },
    },
    {
      $lookup: {
        from: 'quize_progress',
        localField: '_id',
        foreignField: 'userId',
        as: 'quize_progress',
      },
    },
    {
      $addFields: {
        journalMistakes: {
          $map: {
            input: '$journals',
            as: 'journal',
            in: { $size: '$$journal.mistakes' },
          },
        },
        // journalNotes: {
        //   $map: {
        //     input: "$journals",
        //     as: "journal",
        //     in: { $size: "$$journal.notes" },
        //   },
        // },
      },
    },
    {
      $addFields: {
        mistakesMade: { $sum: '$journalMistakes' },
        notesTaken: { $sum: '$journalNotes' },
      },
    },
    {
      $project: {
        bookmarkSaved: { $size: '$bookmarks' },
        taskCompleted: {
          $size: {
            $filter: {
              input: '$tasks',
              as: 'task',
              cond: { $eq: ['$$task.status', 'completed'] },
            },
          },
        },
        taskCreated: { $size: '$tasks' },
        journalCreated: { $size: '$journals' },
        mistakesMade: 1,
        // notesTaken: 1,
        quizTaken: { $size: '$quize_progress' },
      },
    },
  ];

  return pipeline;
};
