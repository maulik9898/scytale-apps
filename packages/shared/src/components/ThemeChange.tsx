import { Component, For, onMount } from 'solid-js';
import { themeChange } from 'theme-change';
import { themes } from '../data/Themes';
import { HiOutlineColorSwatch } from 'solid-icons/hi';

const ThemeChange: Component = () => {
  onMount(async () => {
    themeChange();
  });
  return (
    <div class="dropdown dropdown-end">
      <label tabIndex={0} class="btn">
        <HiOutlineColorSwatch size={24} class="" />
      </label>
      <div
        class={`dropdown-content mt-2 bg-base-200 text-base-content rounded-t-box rounded-b-box max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl`}
      >
        <div class="grid grid-cols-1 gap-3 p-3" tabindex="0">
          <For each={themes}>
            {(theme) => (
              <div
                class="outline-base-content overflow-hidden rounded-lg outline outline-2 outline-offset-2"
                data-set-theme={theme.id}
                data-act-class="outline"
              >
                <div
                  data-theme={theme.id}
                  class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                >
                  <div class="grid grid-cols-5 grid-rows-3">
                    <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
                      <div class="flex-grow text-sm font-bold">{theme.id}</div>
                      <div class="flex flex-shrink-0 flex-wrap gap-1">
                        <div class="bg-primary w-2 rounded" />
                        <div class="bg-secondary w-2 rounded" />
                        <div class="bg-accent w-2 rounded" />
                        <div class="bg-neutral w-2 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default ThemeChange;
