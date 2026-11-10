export interface ContentEntry {
  slug: string;
  category: string;
  title: string;
  summary: string;
  sections: { heading: string; text: string }[];
}

export const projects: ContentEntry[] = [
  {
    slug: 'file-sharing-website',
    category: 'Web application',
    title: 'File Sharing Website',
    summary: 'A web tool for sharing ZIP archives with optional access credentials.',
    sections: [
      { heading: 'Archive sharing', text: 'Users can upload a ZIP archive and share it with a recipient. For files that need restricted access, the sender can set a username and password.' },
      { heading: 'Download library', text: 'The site also includes a directory of commonly used software for visitors to download.' },
    ],
  },
  {
    slug: 'leave-management-application',
    category: 'Workforce software',
    title: 'Leave Management Application',
    summary: 'A system for requesting, routing and approving employee leave, with reporting on web and mobile.',
    sections: [
      { heading: 'Request and approval workflow', text: 'Employees submit leave or short-leave requests. Team leads review requests and can escalate them to senior approvers. The system notifies employees when their leave is approved.' },
      { heading: 'Administration and access controls', text: 'Administrators can review leave statistics on web and mobile. Location and VPN checks enforce the organization’s rules for submitting requests.' },
    ],
  },
];

export const posts: ContentEntry[] = [
  {
    slug: 'php-security-vulnerabilities-october-2026',
    category: 'Cybersecurity',
    title: 'PHP security updates and your website',
    summary: 'How to turn a PHP security advisory into a maintenance plan for a business website.',
    sections: [
      { heading: 'Check what you run', text: 'List the PHP versions behind your production and staging sites. Include the frameworks, extensions and plugins those sites rely on so you can see where an update could affect compatibility.' },
      { heading: 'Test the update', text: 'Use staging to test common tasks such as signing in, submitting forms and uploading files. Keep a recovery point before release, then review application logs after the update.' },
    ],
  },
  {
    slug: 'signs-business-website-needs-upgrade',
    category: 'Web development',
    title: 'When your business website needs an upgrade',
    summary: 'Look for friction on mobile, outdated information and maintenance work that keeps piling up.',
    sections: [
      { heading: 'Walk through the site as a customer', text: 'On a phone, try to find a service, compare your options and send an enquiry. Slow pages, awkward forms and unclear navigation all make those tasks harder.' },
      { heading: 'Review what your team can maintain', text: 'Check how easily your team can update pages and keep dependencies current. Use those findings to decide where a targeted fix will help and where the underlying platform needs work.' },
    ],
  },
  {
    slug: 'how-pharmacy-management-software-helps-businesses',
    category: 'Business software',
    title: 'How software helps pharmacies run day to day',
    summary: 'See how stock, expiry dates, sales and reporting can work together in a pharmacy.',
    sections: [
      { heading: 'Keep stock records current', text: 'Tracking batch numbers, expiry dates and low stock in one place helps staff identify items that need attention before they affect daily operations.' },
      { heading: 'Connect the counter and the back office', text: 'When sales update stock records, staff can check availability at the counter while managers review sales and inventory reports from the same records.' },
    ],
  },
  {
    slug: '5-signs-your-business-needs-custom-software',
    category: 'Business software',
    title: 'When custom software makes sense',
    summary: 'Recognize the point at which spreadsheets, manual handoffs and disconnected tools start slowing your team down.',
    sections: [
      { heading: 'Find the repeated work', text: 'Look for information that people copy between tools, approvals that get stuck in messages and reports that take hours to assemble. Those are useful starting points for defining what software needs to do.' },
      { heading: 'Start with one workflow', text: 'Identify the people, inputs and approvals involved. A well-defined workflow gives you something concrete to test with the team before you extend the software to other tasks.' },
    ],
  },
];

export const postCards = posts.map(post => ({ ...post, href: `/blog/${post.slug}/` }));
