export const formatTextArtifact = (text: string) => {
    text = text.trim().replace(/\s/g, '');
    let code = '';
    code += `\`${text[0]}\` \`${text[1]}\` \`${text[2]}\`\n`;
    code += `\`${text[3]}\` \`${text[4]}\` \`${text[5]}\`\n`;
    code += `\`${text[6]}\` \`${text[7]}\` \`${text[8]}\``;
    return code;
};
