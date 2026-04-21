export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const token = process.env.NOTION_TOKEN;
  
  const avaTaskId = '3496b8e6118c8006af9cf168a90b404b';
  const kpTaskId = '3496b8e6118c807ca244e424c8688878';
  
  const [avaRes, kpRes] = await Promise.all([
    fetch(`https://api.notion.com/v1/pages/${avaTaskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
      },
    }),
    fetch(`https://api.notion.com/v1/pages/${kpTaskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
      },
    })
  ]);

  const avaData = await avaRes.json();
  const kpData = await kpRes.json();

  res.status(200).json({
    ava: avaData?.properties?.Assigned?.people || avaData,
    kp: kpData?.properties?.Assigned?.people || kpData,
  });
}