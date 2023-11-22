import React, { useState } from 'react';
import './App.css';
import { NavLink, Route, Routes } from 'react-router-dom';
import { v4 } from 'uuid';
import { Button, Icon, Modal, Text, TextInput } from '@gravity-ui/uikit';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { Xmark } from '@gravity-ui/icons';

const queryClient = new QueryClient();

const TaskList: React.FC<{ index: number, subjects: string[] }> = ({
    index,
    subjects,
}) => {
    const { isLoading, error, data } = useQuery(
      `fetch-title-${subjects?.[index]}`,
      // eslint-disable-next-line no-undef
      () => fetch(`${process.env.REACT_APP_SERVER_URL}`));
    if (error) return <div>error</div>;
    if (isLoading) return <div>loading</div>;
    return <div>{data?.ok}</div>;
};

const MainPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const { data, status } = useQuery('subjects',
      async () => {
          const res = await fetch(
            // eslint-disable-next-line no-undef
            `${process.env.REACT_APP_SERVER_URL}/api/subjects`);
          if (!res.ok) throw Error(res.status.toString());
          return res.json();
      });

    if (status === 'error') return <div>Could not fetch data</div>

    return (
      <main className="p-4">
          <div className="flex gap-3 pb-6">
              {data?.map((subject: string, index: number) => {
                  return <Button key={v4()} selected={index === tabIndex}
                                 disabled={index >= 2}
                                 size="l" onClick={() => {
                      setTabIndex(index);
                  }}>{subject}</Button>;
              })}
          </div>

          <div>
              <h3>{data?.at(tabIndex)}</h3>
              <TaskList index={tabIndex} subjects={data}/>
          </div>
      </main>
    );
};

const Header = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    return (
      <header className="flex gap-3 items-center mr-2 h-15 p-3">
          <Text variant="header-1"><NavLink to="/">UchiForces</NavLink></Text>
          <Button size="m"
                  onClick={() => setRegisterOpen(
                    !loginOpen)}>Зарегистрироваться</Button>
          <Modal open={registerOpen}
                 onOutsideClick={() => setRegisterOpen(false)}>
              <form className="w-80 h-40 flex flex-col p-4 pt-9 gap-3 relative">
                  <Button className="!absolute !right-3 !top-1"
                          onClick={() => setRegisterOpen(false)}
                          view="flat"><Icon data={Xmark}/></Button>
                  <TextInput type="email" label="Почта: "/>
                  <TextInput type="password" label="Пароль: "/>
                  <Button type="submit">Зарегистрироваться</Button>
              </form>
          </Modal>
          <Button size="m"
                  onClick={() => setLoginOpen(!loginOpen)}>Войти</Button>
          <Modal open={loginOpen} onOutsideClick={() => setLoginOpen(false)}>
              <form className="w-80 h-40 flex flex-col p-4 pt-9 gap-3 relative">
                  <Button className="!absolute !right-3 !top-1"
                          onClick={() => setLoginOpen(false)} view="flat"><Icon
                    data={Xmark}/></Button>
                  <TextInput type="email" label="Почта: "/>
                  <TextInput type="password" label="Пароль: "/>
                  <Button type="submit">Войти</Button>
              </form>
          </Modal>
      </header>
    );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
      <Header/>
      <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/home" element={<MainPage/>}/>
      </Routes>
  </QueryClientProvider>
);

export default App;
