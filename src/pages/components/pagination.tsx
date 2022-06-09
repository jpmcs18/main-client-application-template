import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

export default function Pagination({
  pages,
  currentPageNumber,
  goInPage,
}: {
  pages: number;
  currentPageNumber: number;
  goInPage: (page: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState<number>(currentPageNumber);
  const [canGoFirst, setGoFirst] = useState<boolean>(false);
  const [canGoBefore, setGoBefore] = useState<boolean>(false);
  const [canGoAfter, setGoAfter] = useState<boolean>(false);
  const [canGoLast, setGoLast] = useState<boolean>(false);
  const [pageList, setPageList] = useState<number[]>([]);

  useEffect(() => {
    setCurrentPage(currentPageNumber);
    let pl: number[] = [];
    for (let i = 1; i <= pages; i++) {
      pl.push(i);
    }
    setPageList(pl);

    setGoAfter(false);
    setGoLast(false);
    setGoFirst(false);
    setGoBefore(false);

    if (pages > 1) {
      if (currentPageNumber !== pages) {
        setGoAfter(true);
        setGoLast(true);
      }
      if (currentPageNumber !== 1) {
        setGoFirst(true);
        setGoBefore(true);
      }
    }

    return () => {
      pl = [];
    };
  }, [pages, currentPageNumber]);

  function goToFirst() {
    if (!canGoFirst) return;

    goInPage(1);

    setGoFirst(false);
    setGoBefore(false);
    setGoAfter(true);
    setGoLast(true);
  }

  function goToBefore() {
    if (!canGoBefore) return;
    setCurrentPage((cp) => {
      cp = cp - 1;
      if (cp === 1) {
        setGoFirst(false);
        setGoBefore(false);
      }

      goInPage(cp);

      return cp;
    });

    setGoAfter(true);
    setGoLast(true);
  }

  function goToAfter() {
    if (!canGoAfter) return;
    setCurrentPage((cp) => {
      cp = cp + 1;
      if (cp === pages) {
        setGoAfter(false);
        setGoLast(false);
      }

      goInPage(cp);
      return cp;
    });

    setGoFirst(true);
    setGoBefore(true);
  }

  function goToLast() {
    if (!canGoLast) return;
    setCurrentPage(pages);
    setGoAfter(false);
    setGoLast(false);

    setGoFirst(true);
    setGoBefore(true);

    goInPage(pages);
  }

  function goToPage(page: number) {
    setCurrentPage(page);
    setGoFirst(true);
    setGoBefore(true);
    setGoAfter(true);
    setGoLast(true);

    if (page === 1) {
      setGoFirst(false);
      setGoBefore(false);
    }

    if (page === pages) {
      setGoAfter(false);
      setGoLast(false);
    }

    goInPage(page);
  }

  return (
    <div className='pagination'>
      <FontAwesomeIcon
        icon={faAngleDoubleLeft as IconProp}
        className={!canGoFirst ? 'disabled' : ''}
        onClick={goToFirst}
      />
      <FontAwesomeIcon
        icon={faAngleLeft as IconProp}
        onClick={goToBefore}
        className={!canGoBefore ? 'disabled' : ''}
      />
      <div className='pages-container'>
        <button className='current-page'>{currentPage}</button>
        <div className='pages'>
          {pageList.map((pl) => (
            <div
              key={pl}
              className={pl === currentPage ? 'active' : ''}
              onClick={() => {
                goToPage(pl);
              }}>
              {pl}
            </div>
          ))}
        </div>
      </div>
      <FontAwesomeIcon
        icon={faAngleRight as IconProp}
        onClick={goToAfter}
        className={!canGoAfter ? 'disabled' : ''}
      />
      <FontAwesomeIcon
        icon={faAngleDoubleRight as IconProp}
        onClick={goToLast}
        className={!canGoLast ? 'disabled' : ''}
      />
    </div>
  );
}
