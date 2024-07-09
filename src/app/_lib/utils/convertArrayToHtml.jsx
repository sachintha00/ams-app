import { useDispatch, useSelector } from "react-redux";

export const convertArrayToHtml = (array) => {
    const design = useSelector((state) => state.dragableSurface.design);

    const populateHtmlWithUserDetails = (template, users) => {
        const userDetailsHtml = users.map(user => `
          <li class="py-3 sm:py-4">
            <div class="flex items-center">
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">${user.name}</p>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">${user.email}</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">${user.status}</div>
              <div class="text-sm text-gray-500 truncate dark:text-gray-400">${user.date}</div>
            </div>
          </li>`).join('');
    
        return template.replace('<ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700" id="user-list">', 
          `<ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">${userDetailsHtml}`);
    };

    return array.map(user => design).join('');
};