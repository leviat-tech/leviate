## 🐶 Husky Setup Notes

### 📁 Husky Directory Location

By default, the `.husky` folder should be at the **root level** of your application.

If you want to move it inside a custom folder like `.project/`, you must tell Git where to find it:

```bash
git config core.hooksPath .project/.husky
```

Also you need to add permisions for husky:
```bash
chmod +x .husky/pre-commit
```

