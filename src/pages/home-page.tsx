import { BrowserRouter, Route, NavLink, Switch } from 'react-router-dom';
import {
  useAuthorize,
  useSetMessage,
  useUpdateAuthorize,
  useUserProfile,
} from '../custom-hooks/authorize-provider';
import LoginPage from './login-page';
import UserPage from './user-page';

import { Routes } from '../routes';
import { useMemo, useState } from 'react';
import ManageProfile from './modals/manage-profile';
import { ICON } from '../constant';
import RolePage from './role-page';
import ConcernPage from './concern-page';
import TicketPage from './ticket-page';
import ReportPage from './report-page';

export default function HomePage() {
  const [showProfile, setShowProfile] = useState(false);
  const authorize = useAuthorize();
  const profile = useUserProfile();
  const updateAuthorize = useUpdateAuthorize();
  const setMessage = useSetMessage();
  const menus: { head: string; navs: { route: string; name: string }[] }[] =
    useMemo(
      () => [
        {
          head: 'Transactions',
          navs: [
            {
              route: Routes.Concern,
              name: 'Concerns',
            },
            {
              route: Routes.Ticket,
              name: 'Tickets',
            },
          ],
        },
        {
          head: 'Managements',
          navs: [
            {
              route: Routes.Role,
              name: 'Roles',
            },
          ],
        },
      ],
      []
    );
  function logoutUser() {
    setMessage({
      message: 'Continue to logout?',
      action: 'YESNO',
      onOk: () => {
        updateAuthorize(false);
        setShowProfile(false);
      },
    });
  }

  return (
    <>
      {authorize ? (
        <BrowserRouter>
          <header className='navbar'>
            <div className='menu-container'>
              <NavLink to={Routes.Home} className='icon'>
                {ICON}
              </NavLink>
              <nav>
                <div>
                  <ul className='navigations'>
                    <li>
                      <button className='nav-menu'>Menus</button>
                      <div className='menus'>
                        {menus.map((menu) => (
                          <div className='menu-items' key={menu.head}>
                            <div className='head'>{menu.head}</div>
                            <div className='navs'>
                              {menu.navs.map((nav) => (
                                <div key={nav.route}>
                                  <NavLink to={nav.route} className='nav-menu'>
                                    {nav.name}
                                  </NavLink>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </li>
                    {profile?.admin && (
                      <li>
                        <NavLink to={Routes.User} className='nav-menu'>
                          Users
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
                <ul className='user'>
                  <li>
                    <label
                      className='user-name nav-menu'
                      onClick={() => setShowProfile(true)}>
                      {`${profile?.personnel?.name} (${profile?.personnel?.classification?.description})`}
                    </label>
                  </li>
                  <li>
                    <label onClick={logoutUser} className='nav-menu'>
                      Logout
                    </label>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <Switch>
            <Route path={Routes.User} exact component={UserPage} />
            <Route path={Routes.Role} exact component={RolePage} />
            <Route path={Routes.Concern} exact component={ConcernPage} />
            <Route path={Routes.Ticket} exact component={TicketPage} />
            <Route path={'/report'} exact component={ReportPage} />
          </Switch>
          <div>
            {showProfile && (
              <ManageProfile onClose={() => setShowProfile(false)} />
            )}
          </div>
        </BrowserRouter>
      ) : (
        <LoginPage />
      )}
    </>
  );
}
