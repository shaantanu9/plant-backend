import { generateContent } from './gemeniModel';

const createPersonalizedSummary = async (journals: any[], bookmarks: string[], task: string[]) => {
  let summary = '';

  if (journals.length === 0 && bookmarks.length === 0 && task.length === 0) {
    return 'No data available to summarize';
  }

  if (journals.length !== 0) {
    journals.forEach(journal => {
      const {
        // createdBy,
        relationshipNotes,
        communityInvolvement,
        financialGoals,
        networkingEvents,
        professionalFeedback,
        careerObjectives,
        lifeLessons,
        happinessDrivers,
        anxietyTriggers,
        reflections,
        personalDiary,
        newIdeas,
        healthFitness,
        challengesFaced,
        gratitude,
        goalsForTomorrow,
        learnToday,
        doneToday,
        media,
        mistakes,
        weekGoals,
        monthGoals,
        quarterGoals,
        yearGoals,
        lifetimeGoals,
        placeToVisit,
        booksToRead,
        moviesToWatch,
        podcastsToListen,
        videoToCreate,
        videoToWatch,
        articleToRead,
        coursesToTake,
        skillsToLearn,
        skillsToTeach,
        peopleToMeet,
        peopleToInvite,
        peopleToThank,
        peopleToForgive,
        peopleToHelp,
        peopleToHire,
        peopleToFire,
        peopleToConnect,
        peopleToAvoid,
        peopleToLove,
        peopleToRespect,
        peopleToAppreciate,
        peopleToFollowUp,
        peopleToCheckIn,
        peopleToCheckOn,
        budgeting,
        mentalHealthSessions,
        dietaryIntake,
        mood,
        meals,
        exercises,
        mediaConsumed,
        meetings,
        expenses,
        createdAt,
        // updatedAt,
      } = journal;

      summary += `Journal Entry on ${new Date(createdAt).toLocaleDateString()}:\n\n`;

      const entries = [
        { label: 'Relationship Notes', values: relationshipNotes },
        { label: 'Community Involvement', values: communityInvolvement },
        { label: 'Financial Goals', values: financialGoals },
        { label: 'Networking Events', values: networkingEvents },
        { label: 'Professional Feedback', values: professionalFeedback },
        { label: 'Career Objectives', values: careerObjectives },
        { label: 'Life Lessons', values: lifeLessons },
        { label: 'Happiness Drivers', values: happinessDrivers },
        { label: 'Anxiety Triggers', values: anxietyTriggers },
        { label: 'Reflections', values: reflections },
        { label: 'Personal Diary', values: personalDiary },
        { label: 'New Ideas', values: newIdeas },
        { label: 'Health & Fitness', values: healthFitness },
        { label: 'Challenges Faced', values: challengesFaced },
        { label: 'Gratitude', values: gratitude },
        { label: 'Goals for Tomorrow', values: goalsForTomorrow },
        { label: 'Learned Today', values: learnToday },
        { label: 'Accomplishments Today', values: doneToday },
        { label: 'Media', values: media },
        { label: 'Mistakes', values: mistakes },
        { label: 'Week Goals', values: weekGoals },
        { label: 'Month Goals', values: monthGoals },
        { label: 'Quarter Goals', values: quarterGoals },
        { label: 'Year Goals', values: yearGoals },
        { label: 'Lifetime Goals', values: lifetimeGoals },
        { label: 'Places to Visit', values: placeToVisit },
        { label: 'Books to Read', values: booksToRead },
        { label: 'Movies to Watch', values: moviesToWatch },
        { label: 'Podcasts to Listen', values: podcastsToListen },
        { label: 'Videos to Create', values: videoToCreate },
        { label: 'Videos to Watch', values: videoToWatch },
        { label: 'Articles to Read', values: articleToRead },
        { label: 'Courses to Take', values: coursesToTake },
        { label: 'Skills to Learn', values: skillsToLearn },
        { label: 'Skills to Teach', values: skillsToTeach },
        { label: 'People to Meet', values: peopleToMeet },
        { label: 'People to Invite', values: peopleToInvite },
        { label: 'People to Thank', values: peopleToThank },
        { label: 'People to Forgive', values: peopleToForgive },
        { label: 'People to Help', values: peopleToHelp },
        { label: 'People to Hire', values: peopleToHire },
        { label: 'People to Fire', values: peopleToFire },
        { label: 'People to Connect', values: peopleToConnect },
        { label: 'People to Avoid', values: peopleToAvoid },
        { label: 'People to Love', values: peopleToLove },
        { label: 'People to Respect', values: peopleToRespect },
        { label: 'People to Appreciate', values: peopleToAppreciate },
        { label: 'People to Follow Up', values: peopleToFollowUp },
        { label: 'People to Check In', values: peopleToCheckIn },
        { label: 'People to Check On', values: peopleToCheckOn },
        { label: 'Budgeting', values: budgeting },
        { label: 'Mental Health Sessions', values: mentalHealthSessions },
        { label: 'Dietary Intake', values: dietaryIntake },
        { label: 'Mood', values: mood },
        { label: 'Meals', values: meals },
        { label: 'Exercises', values: exercises },
        { label: 'Media Consumed', values: mediaConsumed },
        { label: 'Meetings', values: meetings },
        { label: 'Expenses', values: expenses },
      ];

      entries.forEach(({ label, values }) => {
        if (values && values.length > 0) {
          summary += `${label}:\n`;
          values.forEach((value: string) => {
            summary += `- ${value}\n`;
          });
          summary += '\n';
        }
      });
    });
  }

  const detailedSummary = await generateContent(
    bookmarks.join(' ') +
      ' this are the bookmarks i have saved' +
      ' ' +
      task.join(' ') +
      ' this are the tasks i have saved' +
      ' ' +
      summary +
      '\nPlease summarize the above journal entries and provide a brief overview with a personal touch. Focus on highlighting key takeaways and insights from the journal entries.',
  );

  return detailedSummary;
};

export { createPersonalizedSummary };
