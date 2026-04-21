export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const token = process.env.NOTION_TOKEN;
  
  const response = await fetch('https://api.notion.com/v1/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    },
  });

  const data = await response.json();
  res.status(200).json(data);
}