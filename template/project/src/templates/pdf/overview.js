import halfenTitleBlock from './titleblocks/halfen-a4-portrait';

export default function (payload, meta) {
  // const sideSvg = assemblyDraft.render('assembly', ['side', payload.assemblies[0]], 'svg');
  // const topSvg = assemblyDraft.render('assembly', ['top', payload.assemblies[0]], 'svg');

  const content = payload.assemblies.map((assembly, i) => {
  });

  const doc = halfenTitleBlock(payload, meta);

  doc.content = content;

  return doc;
}
