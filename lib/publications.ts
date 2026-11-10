// Title, authors, posting date, DOI and abstract are taken from the medRxiv PDF in
// past_projects_reference/Stress Cardiomyopathy Project. The preprint is CC BY 4.0.
// Status must stay exactly what the source says. Never upgrade it.
// The ISBI entry: title and authors from the November 2 draft PDF in
// past_projects_reference/Aortic Dilation Project; status as stated by the user on
// November 10, 2026. No results are shown while it is under review.
export type Publication = {
  year: string; title: string; authors: string[]; venue: string; note: string; object: 'ecg-cart' | 'lightbox';
  href?: string; abstract?: [string, string][]; bibtex?: string;
};

export const publications: Publication[] = [
  {
    year: '2026',
    title: 'Estimating Echocardiographic Aortic Diameter from Chest Radiographs, ECGs, and Clinical Variables: A Controlled Design Study in MIMIC-IV',
    authors: ['Chenjia Zhang', 'Robert D. Stevens'],
    venue: 'ISBI 2027 · Under review',
    note: 'Manuscript under review · arXiv version in revision',
    object: 'lightbox',
  },
  {
    year: '2026',
    title: 'Deep Learning Decodes Latent ECG Signatures of Stress Cardiomyopathy',
    authors: ['Jooyoung Ryu', 'Carl Harris', 'Chenjia Zhang', 'Kirby Gong', 'Robert D. Stevens'],
    venue: 'medRxiv · Preprint',
    note: 'Preprint posted January 23, 2026 · Not peer reviewed',
    object: 'ecg-cart',
    href: 'https://doi.org/10.64898/2026.01.21.26344596',
    abstract: [
      ['Background', 'Stress cardiomyopathy (SCM) shares features with acute myocardial infarction (AMI) which may lead to misdiagnosis and misaligned management decisions. We hypothesize that features derived from the 12-lead ECG can identify cases of SCM and differentiate them from AMI.'],
      ['Methods', 'Using data from a large registry of critically ill patients, we trained a deep learning algorithm to perform two classification tasks: (1) SCM vs. Non-SCM and (2) SCM vs. AMI. Model training was accomplished with 3 different sets of input features: raw ECG waveforms, clinical features from the electronic health record (EHR), and a fusion model combining ECG with clinical data. SHapley Additive exPlanations (SHAP) analysis was performed to identify the most influential predictive features.'],
      ['Results', 'Among 71,479 patients admitted to ICU, 349 (0.48%) were diagnosed with SCM while 4,507 (6.31%) had AMI. The clinical-ECG fusion model achieved best performance, with area under the precision-recall curve (AUPRC) values of 0.191 (0.146-0.243) for SCM vs. Non-SCM and 0.430 (0.371-0.488) for SCM vs. AMI, outperforming baseline AUPRCs of 0.0048 and 0.0625, respectively. The fusion model outperformed both the waveform model (p < 0.001) and the EHR model (p < 0.001) for both SCM vs. Non-SCM and SCM vs. AMI. The waveform model achieved AUPRC values of 0.089 (0.062-0.125) for SCM vs. Non-SCM and 0.309 (0.257-0.374) for SCM vs. AMI. There was no statistically significant difference in performance between the waveform model and the EHR model for both tasks. SHAP analysis highlighted female gender as well as congestive heart failure (CHF) and hypertension as the features most influential in predicting SCM.'],
      ['Conclusion', 'Findings indicate that ECG waveforms contain latent information which supports the detection of SCM in patients admitted to the ICU. ECG-based deep learning screening could enable early identification and treatment of SCM and might be particularly valuable in resource-constrained environments.'],
    ],
    bibtex: `@article{ryu2026deep,
  title   = {Deep Learning Decodes Latent ECG Signatures of Stress Cardiomyopathy},
  author  = {Ryu, Jooyoung and Harris, Carl and Zhang, Chenjia and Gong, Kirby and Stevens, Robert D.},
  journal = {medRxiv},
  year    = {2026},
  doi     = {10.64898/2026.01.21.26344596},
  note    = {Preprint, not peer reviewed}
}`,
  },
];

/** Short status lines shown on research cards, by research id in lib/profile.ts. */
export const researchStatus: Record<string, string> = {
  'aortic-dilation': 'Manuscript under review · ISBI 2027 · arXiv version in revision',
};
