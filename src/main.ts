import App from './App.svelte'

// window.testData = JSON.stringify([
//   {
//     title: 'Root',
//     temp: '',
//     children: [
//       {
//         title: 'Child 1',
//         temp: '',
//         children: [
//           {
//             title: 'Grandchild 1',
//             temp: '',
//             children: [],
//           },
//           {
//             title: 'Grandchild 2',
//             temp: '',
//             children: [],
//           },
//           {
//             title: 'Grandchild 3',
//             temp: '',
//             children: [],
//           },
//         ],
//       },
//       {
//         title: 'Child 2',
//         temp: '',
//         children: [
//           {
//             title: 'Grandchild 1',
//             temp: '',
//             children: [],
//           },
//           {
//             title: 'Grandchild 2',
//             temp: '',
//             children: [],
//           },
//           {
//             title: 'Grandchild 3',
//             temp: '',
//             children: [],
//           },
//         ],
//       },
//       {
//         title: 'Child 3',
//         temp: '',
//         children: [
//           {
//             title: 'Grandchild 1',
//             temp: '',
//             children: [],
//           },
//           {
//             title: 'Grandchild 2',
//             temp: '',
//             children: [],
//           },
//           {
//             title: 'Grandchild 3',
//             temp: '',
//             children: [],
//           },
//         ],
//       },
//     ],
//   },
// ])

const app = new App({
  target: document.getElementById('app'),
})

export default app
