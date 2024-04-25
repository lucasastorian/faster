/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  safelist: [
    'relative',
    'w-full',
    'bg-slate-800',
    'rounded-md',
    'h-8',
    'flex',
    'items-center',
    'justify-start',
    'justify-between',
    'px-4',
    'bg-slate-700',
    'rounded-t-md',
    'text-white',
    'text-[10px]',
    'text-xs',
    'text-sm',
    'w-3',
    'h-3',
    'text-white',
    'p-4',
    'mt-0',
    'py-0',
    'my-0',
    'overflow-x-auto',
    'space-x-2'
  ],
};
