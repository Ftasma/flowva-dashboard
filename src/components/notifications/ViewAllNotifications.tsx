import { List, Card, Button, message } from "antd";
import { useNotifications } from "../../hooks/dashboard/useNotifications";
import { Link } from "react-router-dom";
import { acceptShare } from "../../services/shareService";

export default function ViewAllNotifications() {
  const { notifications, loading, markAsRead, refresh } = useNotifications();

  if (loading) return <p>Loading…</p>;

  return (
    <Card title="All Notifications" extra={<Button onClick={refresh}>Refresh</Button>}>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={n => {
          const p = JSON.parse(n.content);
          return (
            <List.Item
              style={{ background: n.read?"white":"#e6f7ff", padding:"16px" }}
              actions={[
                n.type==="share_invite" && !n.read && (
                  <Button key="accept" type="primary"
                    onClick={async () => {
                      try {
                        await acceptShare(n.related_token!);
                        message.success("Accepted!");
                        await markAsRead(n.id);
                        refresh();
                      } catch(e:any){ message.error(e.message) }
                    }}
                  >Accept</Button>
                ),
                <Link key="view" to={p.link}><Button>View</Button></Link>
              ]}
              onClick={() => n.read || markAsRead(n.id)}
            >
              <List.Item.Meta title={p.title} description={p.body} />
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
