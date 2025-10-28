(function () {
  'use strict';

  var AFF = window.AFF = window.AFF || {};

  var templates = {
    finance: {
      title: 'Abundant wealth steward',
      prompt: 'Anchor to a money win, name how you show up, close with gratitude.',
      template: 'I celebrate how I {action} so I can {outcome}, and I give thanks for every opportunity to grow wealth wisely.'
    },
    health: {
      title: 'Whole-body vitality',
      prompt: 'Tie daily habit to the way it makes you feel.',
      template: 'Every day I {habit}, energizing my body and mind so I feel {feeling} and ready for the day.'
    },
    career: {
      title: 'Purpose-led work',
      prompt: 'Name your contribution and the impact on others.',
      template: 'I bring {strength} to every project, creating {impact} for the people I serve.'
    },
    relationships: {
      title: 'Connected relationships',
      prompt: 'Describe how you show up and the quality you receive back.',
      template: 'I listen with {quality}, and the people I love feel {result} and meet me with the same warmth.'
    },
    custom: {
      title: 'Design your own mantra',
      prompt: 'Keep it positive, present tense, and specific.',
      template: 'I am {identity} who {action} so that {impact}.'
    }
  };

  var whyItWorks = [
    'Speak in the present tense so your brain codes it as “already true.”',
    'Anchor each affirmation in a specific behavior you control.',
    'Close with a vivid feeling or impact so your nervous system knows why it matters.',
    'Keep the language positive and avoid negations.'
  ];

  AFF.templates = {
    getAll: function () {
      return templates;
    },
    getWhy: function () {
      return whyItWorks.slice();
    }
  };
})();
