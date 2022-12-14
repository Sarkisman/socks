import React, { useState, useEffect } from 'react';
import Sock from './Sock';

export default function Basket({ user }) {
  const [counter, setCounter] = useState(1);
  const changeHandler = (e) => {
    if (e.target.value > 0) {
      setCounter(e.target.value);
    }
  };
  const [userSocs, setUserSocs] = useState([]);
  const [string, setString] = useState('');
  useEffect(() => {
    fetch('/basket/bas')
      .then((data) => data.json())
      .then((data) => {
        setUserSocs(data);
      });
  }, []);
  const basketHandler = (id) => {
    fetch(`/basket/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => setUserSocs(
        (prev) => prev.map((el) => (el.id === id ? { ...el, bascetSt: !el.bascetSt } : el)),
      ));
  };
  const likeHandler = async (id) => {
    fetch(`/basket/${id}`, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then(() => setUserSocs(
        (prev) => prev.map((el) => (el.id === id ? { ...el, favorSt: !el.favorSt } : el)),
      ));
  };
  const orderHandler = () => {
    fetch(`/basket/order/${user.id}`, {
      method: 'POST',
    })
      .then(() => setUserSocs([]))
      .then(() => {
        userSocs.length
          ? (setString(`Ваш заказ добавлен в очередь. На вашу почту ${user.email} отправлено письмо с деталями заказа.`))
          : (setString('Ваша корзина пуста. Перейдите в генератор носков для выбора.'));
      });
  };
  return (
    <div style={{ height: '100%' }} className="d-flex justify-content-center flex-wrap flex-row">
      <div className="d-flex justify-content-center flex-wrap">
        {string}
      </div>
      <div className="mt-2 d-flex justify-content-center flex-wrap">
        {userSocs?.map((el) => el.bascetSt && (
          <div key={el.id} className="card border-0 m-1">
            <div className="">
              <Sock inputs={el} />
            </div>
            <button className="constructor-button" type="button" onClick={() => basketHandler(el.id)}>УБРАТЬ ИЗ КОРЗИНЫ</button>
            {!el.favorSt ? (<button className="constructor-button" type="button" onClick={() => likeHandler(el.id)}>ЛАЙК!</button>) : (<button className="constructor-button" type="button" onClick={() => likeHandler(el.id)}>ДИЗЛАЙК!</button>)}
            <input type="number" onChange={changeHandler} className="count input-group-text mw-50" name="qty" defaultValue="1" min="1" max="100" />
            <div style={{ height: '90px' }} />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center flex-wrap">
        <button
          style={{
            position: 'fixed',
            height: '120px',
            width: '120px',
            borderRadius: '100%',
            bottom: '210px',
            right: '60px',
          }}
          type="button"
          className="constructor-button m-1"
          onClick={orderHandler}
        >
          Заказать
        </button>
      </div>
    </div>
  );
}
