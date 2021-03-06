import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import {
  useAuthorize,
  useSetMessage,
  useUpdateAuthorize,
  useUserProfile,
} from '../custom-hooks/authorize-provider';
import LoginPage from './login-page';
import UserPage from './user-page';

import { useMemo, useState } from 'react';
import { ICON } from '../constant';
import { Routes } from '../routes';
import ConcernPage from './concern-page';
import ManageProfile from './modals/manage-profile';
import RolePage from './role-page';
import TicketPage from './ticket-page';
import ClassificationPage from './classification-page';
import PersonnelPage from './personnel-page';
import OfficePage from './office-page';
import Dashboard from './dashboard';
import SummaryPage from './summary-page';

export default function HomePage() {
  const [showProfile, setShowProfile] = useState(false);
  const authorize = useAuthorize();
  const profile = useUserProfile();
  const updateAuthorize = useUpdateAuthorize();
  const setMessage = useSetMessage();
  const menus: {
    head: string;
    navs: { route: string | undefined; name: string | undefined }[];
  }[] = useMemo(
    () => [
      ...(profile?.admin
        ? [
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
                {
                  route: Routes.Summary,
                  name: 'Summary',
                },
              ],
            },
            {
              head: 'Maintenances',
              navs: [
                {
                  route: Routes.User,
                  name: 'Users',
                },
                {
                  route: Routes.Personnel,
                  name: 'Personnels',
                },
                {
                  route: Routes.Role,
                  name: 'Roles',
                },
                {
                  route: Routes.Classification,
                  name: 'Classifications',
                },
                {
                  route: Routes.Office,
                  name: 'Offices',
                },
              ],
            },
          ]
        : [
            {
              head: 'Transactions',
              navs: [
                ...(profile?.distinctModules
                  ?.filter((x) => x.header === 'Transaction')
                  .map((x) => {
                    return { route: x.route, name: x.description };
                  }) ?? []),
              ],
            },
            {
              head: 'Maintenances',
              navs: [
                ...(profile?.distinctModules
                  ?.filter((x) => x.header === 'Maintenance')
                  .map((x) => {
                    return { route: x.route, name: x.description };
                  }) ?? []),
              ],
            },
          ]),
    ],
    [profile?.distinctModules, profile?.admin]
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
          <header>
            <nav>
              <div className='menu-container'>
                <NavLink to={Routes.Home} exact className='nav-icon'>
                  {ICON}
                </NavLink>
                {(profile?.distinctModules?.length ?? 0) <= 3 &&
                (profile?.distinctModules?.length ?? 0) > 0 ? (
                  <>
                    {profile?.distinctModules?.map((x) => (
                      <NavLink
                        to={x.route ?? ''}
                        exact
                        className='nav-menu'
                        key={x.accessId}>
                        {x.description}
                      </NavLink>
                    ))}
                  </>
                ) : (
                  <div className='nav-menu-container'>
                    <button className='nav-menu'>Menus</button>
                    <div className='menus'>
                      {menus
                        .filter((x) => x.navs.length > 0)
                        .map((menu) => (
                          <div className='menu-items' key={menu.head}>
                            <div className='head'>{menu.head}</div>
                            <div className='navs'>
                              {menu.navs.map((nav) => (
                                <div key={nav.route}>
                                  <NavLink
                                    to={nav.route ?? ''}
                                    exact
                                    className='nav-menu'>
                                    {nav.name}
                                  </NavLink>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className='menu-container'>
                <label
                  className='user-name nav-menu'
                  onClick={() => setShowProfile(true)}>
                  {`${profile?.personnel?.name} (${profile?.personnel?.classification?.description})`}
                </label>
                <label onClick={logoutUser} className='nav-menu'>
                  Logout
                </label>
              </div>
            </nav>
          </header>
          <Switch>
            <Route path={Routes.Home} exact component={Dashboard} />
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.User
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.User} exact component={UserPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Role
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Role} exact component={RolePage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Concern
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Concern} exact component={ConcernPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Ticket
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Ticket} exact component={TicketPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Classification
            )?.[0]?.id ||
              profile?.admin) && (
              <Route
                path={Routes.Classification}
                exact
                component={ClassificationPage}
              />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Personnel
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Personnel} exact component={PersonnelPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Office
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Office} exact component={OfficePage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Summary
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Summary} exact component={SummaryPage} />
            )}
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
