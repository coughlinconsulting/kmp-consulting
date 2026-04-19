export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page_size: 100,
      filter: {
        and: [
          {
            property: 'Status',
            status: { does_not_equal: 'Done' }
          },
          {
            property: 'Status',
            status: { does_not_equal: 'No Longer Needed' }
          }
        ]
      }
    }),
  });

  const data = await response.json();
  const tasks = data.results;

  const today = new Date().toISOString().split('T')[0];
  const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const stats = {
    overdue: 0,
    dueToday: 0,
    dueThisWeek: 0,
    blocked: 0,
    onHold: 0,
    noDueDate: 0,
  };

  for (const task of tasks) {
    const props = task.properties;
    const status = props.Status?.status?.name?.toLowerCase() || '';
    const due = props['Due Date']?.date?.start || null;

    if (status === 'blocked') { stats.blocked++; continue; }
    if (status === 'on hold') { stats.onHold++; continue; }
    if (!due) { stats.noDueDate++; continue; }
    if (due < today) { stats.overdue++; continue; }
    if (due === today) { stats.dueToday++; continue; }
    if (due <= weekEnd) { stats.dueThisWeek++; }
  }

  res.status(200).json(stats);
}}
