import { notification } from 'antd';
import { NotificationPlacement } from 'antd/lib/notification';

interface NotificationProps {
  status: string;
  placement: NotificationPlacement;
  message: string;
  description: string;
  icon: any;
}

export const openNotification = ({
  status,
  placement,
  message,
  description,
  icon,
}: NotificationProps) => {
  switch (status) {
    case 'success':
      return notification.success({
        message,
        description,
        placement,
      });
    case 'error':
      return notification.error({
        message,
        description,
        placement,
      });
    case 'open':
      return notification.open({
        message,
        description,
        placement,
        icon,
      });
    default:
      return;
  }
};
