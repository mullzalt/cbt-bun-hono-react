import * as React from "react";
import {
  InfiniteData,
  UseSuspenseInfiniteQueryResult,
} from "@tanstack/react-query";

import type { ArrayElement } from "@/shared/types/util";

export type ListComponentState = {
  index: number;
  isFirst: boolean;
  isLast: boolean;
};

export interface ListComponentProps<TData> {
  data: TData[];
  render: (data: TData, state: ListComponentState) => React.ReactNode;
  renderOnEmpty?: () => React.ReactNode;
}

export function ListComponent<TData>({
  data,
  render,
  renderOnEmpty,
}: ListComponentProps<TData>) {
  if (data.length < 1 && renderOnEmpty) {
    return <React.Fragment>{renderOnEmpty()}</React.Fragment>;
  }

  return (
    <React.Fragment>
      {data.map((d, i) => (
        <React.Fragment key={i}>
          {render(d, {
            index: i,
            isFirst: i === 0,
            isLast: i === data.length - 1,
          })}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

export type InfiniteQueryState = {
  index: number;
};

export type SuspenseInfiniteQueryListComponentProps<
  TInfinite extends InfiniteData<unknown>,
  TData,
> = UseSuspenseInfiniteQueryResult<TInfinite> & {
  data: TInfinite;
  render: (
    data: TData,
    elementRef: (node: HTMLElement | null) => void,
    state: InfiniteQueryState,
  ) => React.ReactNode;
  renderLastPage?: () => React.ReactNode;
  renderOnLoading?: () => React.ReactNode;
};

export function InfiniteListComponent<
  TInfinite extends InfiniteData<unknown>,
  TData extends TInfinite["pages"][number],
>({
  data,
  render,
  ...props
}: SuspenseInfiniteQueryListComponentProps<TInfinite, TData>) {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    renderLastPage,
    renderOnLoading,
  } = props;

  const observer = React.useRef<IntersectionObserver>();

  const elementRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();


      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetching
        ) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage],
  );

  return (
    <React.Fragment>
      {data.pages.map((p, index) => (
        <React.Fragment key={index}>
          {render(p as TData, elementRef, { index })}
        </React.Fragment>
      ))}
      {renderLastPage && !hasNextPage && renderLastPage()}
      {((renderOnLoading && isFetching) ||
        (renderOnLoading && isFetchingNextPage)) &&
        renderOnLoading()}
    </React.Fragment>
  );
}
