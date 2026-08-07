// AI Career Tools & Resume Analyzer controller
exports.analyzeResume = async (req, res) => {
  const { resumeText, targetRole } = req.body;

  if (!resumeText) {
    return res.status(400).json({ success: false, message: 'Please provide resume text content to analyze' });
  }

  const role = targetRole || 'Full Stack Developer';
  const textLower = resumeText.toLowerCase();

  // Basic ATS & Skill Keyword Extractor simulation
  const techKeywords = ['javascript', 'react', 'node', 'express', 'mongodb', 'typescript', 'tailwind', 'python', 'aws', 'docker', 'git', 'rest api', 'sql'];
  const matchedKeywords = techKeywords.filter(k => textLower.includes(k));
  const missingKeywords = techKeywords.filter(k => !textLower.includes(k)).slice(0, 4);

  const wordCount = resumeText.trim().split(/\s+/).length;
  let atsScore = 70;
  if (matchedKeywords.length >= 5) atsScore += 15;
  if (wordCount >= 200 && wordCount <= 700) atsScore += 10;
  atsScore = Math.min(98, Math.max(55, atsScore));

  const strengths = [
    `Strong alignment with ${role} skill set (${matchedKeywords.join(', ') || 'General tech skills'})`,
    'Clear structure with measurable achievements',
    'Good length and technical vocabulary density'
  ];

  const improvements = [
    `Add missing high-demand industry keywords: ${missingKeywords.join(', ')}`,
    'Quantify outcomes in experience bullet points (e.g. "Increased load speed by 35%")',
    'Include direct links to live GitHub projects and live deployments'
  ];

  return res.json({
    success: true,
    targetRole: role,
    atsScore,
    matchedKeywords,
    missingKeywords,
    strengths,
    improvements,
    summary: `Your resume shows a strong technical foundation for ${role} positions with an ATS rating of ${atsScore}/100.`
  });
};

exports.getRecommendedJobs = async (req, res) => {
  const mockStore = require('../utils/mockStore');
  const userSkills = req.user?.skills || ['React', 'JavaScript', 'Node.js', 'Tailwind CSS'];

  const recommended = mockStore.jobs.map(job => {
    const jobSkills = job.skills || [];
    let match = 70;
    jobSkills.forEach(s => {
      if (userSkills.some(us => us.toLowerCase() === s.toLowerCase())) match += 7;
    });
    match = Math.min(98, match);
    return {
      ...job,
      company: mockStore.findCompanyById(job.companyId) || { name: 'Innovative Solutions' },
      matchScore: match
    };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);

  return res.json({
    success: true,
    jobs: recommended
  });
};
