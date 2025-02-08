import React, { useState } from 'react';
import './Notification.css';

const NotificationComponent = ({ notifications, setNotifications }) => {
  const [newNotification, setNewNotification] = useState({
    name: '',
    recipient: '',
    subject: '',
    title: '',
    body: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification({ ...newNotification, [name]: value });
  };

  const handleAddNotification = () => {
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications); // Atualiza as notificações no pai
    setNewNotification({
      name: '',
      recipient: '',
      subject: '',
      title: '',
      body: ''
    });
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2>Notificações</h2>
        <button className="notification-button" onClick={handleAddNotification}>
          Adicionar Notificação
        </button>
      </div>
      <div className="notification-form">
        <label>
          Nome Notificação:
          <input
            type="text"
            name="name"
            value={newNotification.name}
            onChange={handleInputChange}
            placeholder="Nome Notificação"
          />
        </label>
        <label>
          Destinatário:
          <input
            type="text"
            name="recipient"
            value={newNotification.recipient}
            onChange={handleInputChange}
            placeholder="Destinatário"
          />
        </label>
        <label>
          Assunto:
          <input
            type="text"
            name="subject"
            value={newNotification.subject}
            onChange={handleInputChange}
            placeholder="Assunto"
          />
        </label>
        <label>
          Título:
          <input
            type="text"
            name="title"
            value={newNotification.title}
            onChange={handleInputChange}
            placeholder="Título"
          />
        </label>
        <label>
          Corpo:
          <textarea
            name="body"
            value={newNotification.body}
            onChange={handleInputChange}
            placeholder="Corpo da Notificação"
          />
        </label>
      </div>

      <div className="notification-list">
        <h3>Notificações Adicionadas:</h3>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notif, index) => (
              <li key={index}>
                <h3>{notif.name}</h3>
                <p><b>Destinatário:</b> {notif.recipient}</p>
                <p><b>Assunto:</b> {notif.subject}</p>
                <p><b>Título:</b> {notif.title}</p>
                <p><b>Corpo:</b> {notif.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma notificação adicionada.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationComponent;
